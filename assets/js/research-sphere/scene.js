import * as THREE from '../../vendor/three/three.module.min.js';

const TAU = Math.PI * 2;

function lineFromPoints(points, material) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, material);
}

function circlePoints(radius, segments = 128, yScale = 1) {
  return Array.from({ length: segments + 1 }, (_, index) => {
    const angle = (index / segments) * TAU;
    return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius * yScale);
  });
}

export function createSphereScene(container, model) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
  camera.position.set(0, 0, 7.4);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const root = new THREE.Group();
  scene.add(root);

  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x71e1ff, wireframe: true, transparent: true, opacity: 0.034 });
  root.add(new THREE.Mesh(new THREE.SphereGeometry(2.05, 14, 9), sphereMaterial));

  const coordinateMaterial = new THREE.LineBasicMaterial({ color: 0x9edff0, transparent: true, opacity: 0.115 });
  Array.from({ length: 6 }, (_, index) => index * (Math.PI / 6)).forEach((z) => {
    const circle = lineFromPoints(circlePoints(2.06), coordinateMaterial.clone());
    circle.rotation.z = z;
    root.add(circle);
  });
  [-1.35, -0.72, 0, 0.72, 1.35].forEach((offset) => {
    const radius = Math.sqrt((2.05 ** 2) - (offset ** 2));
    const latitude = lineFromPoints(circlePoints(radius), coordinateMaterial.clone());
    latitude.position.y = offset;
    root.add(latitude);
  });

  const axisMaterial = new THREE.LineBasicMaterial({ color: 0xc9e5ee, transparent: true, opacity: 0.09 });
  [
    [new THREE.Vector3(-2.65, 0, 0), new THREE.Vector3(2.65, 0, 0)],
    [new THREE.Vector3(0, -2.65, 0), new THREE.Vector3(0, 2.65, 0)],
    [new THREE.Vector3(0, 0, -2.65), new THREE.Vector3(0, 0, 2.65)],
  ].forEach((points) => root.add(lineFromPoints(points, axisMaterial.clone())));

  const groupColors = [model.palette.theory, model.palette.research, model.palette.applications];
  const orbitalProfiles = [
    { rotation: [0.34, -0.48, 0.22], radius: 2.59, yScale: 0.84 },
    { rotation: [1.08, 0.18, -0.42], radius: 2.62, yScale: 0.82 },
    { rotation: [-0.56, 0.72, 0.38], radius: 2.57, yScale: 0.86 },
  ];
  const trajectories = groupColors.map((color, index) => {
    const profile = orbitalProfiles[index];
    const pivot = new THREE.Group();
    pivot.rotation.set(...profile.rotation);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.27 });
    const path = lineFromPoints(circlePoints(profile.radius, 160, profile.yScale), material);
    pivot.add(path);
    root.add(pivot);
    return { pivot, path, material, radius: profile.radius, yScale: profile.yScale, particles: [] };
  });

  const nodeGeometry = new THREE.SphereGeometry(0.052, 12, 10);
  const nodeMeshes = model.items.map((item) => {
    const material = new THREE.MeshBasicMaterial({ color: item.color, transparent: true, opacity: 0.82 });
    const mesh = new THREE.Mesh(nodeGeometry, material);
    mesh.position.set(item.position.x, item.position.y, item.position.z).multiplyScalar(2.17);
    mesh.userData = { baseScale: 1, groupIndex: item.groupIndex };
    root.add(mesh);
    return mesh;
  });

  model.groups.forEach((group, groupIndex) => {
    const members = nodeMeshes.filter((mesh) => mesh.userData.groupIndex === groupIndex);
    const points = [];
    members.forEach((mesh, index) => {
      if (index > 0) points.push(members[index - 1].position.clone(), mesh.position.clone());
    });
    if (members.length > 2) points.push(members[0].position.clone(), members[members.length - 1].position.clone());
    const graphMaterial = new THREE.LineBasicMaterial({ color: groupColors[groupIndex], transparent: true, opacity: 0.105 });
    const graph = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), graphMaterial);
    root.add(graph);

    for (let index = 0; index < 3; index += 1) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.026 + index * 0.005, 8, 6),
        new THREE.MeshBasicMaterial({ color: groupColors[groupIndex], transparent: true, opacity: 0.58 }),
      );
      particle.userData.phase = index / 3;
      trajectories[groupIndex].pivot.add(particle);
      trajectories[groupIndex].particles.push(particle);
    }
  });

  [0, 4, 9].forEach((itemIndex, vectorIndex) => {
    const item = model.items[itemIndex];
    const direction = new THREE.Vector3(item.position.x, item.position.y, item.position.z).normalize();
    const arrow = new THREE.ArrowHelper(direction, new THREE.Vector3(), 1.45 + vectorIndex * 0.16, item.color, 0.08, 0.045);
    arrow.line.material.transparent = true;
    arrow.line.material.opacity = 0.18;
    arrow.cone.material.transparent = true;
    arrow.cone.material.opacity = 0.32;
    root.add(arrow);
  });

  const orientation = { x: 0.06, y: -0.2 };
  const target = { x: 0.06, y: -0.2 };
  let selectedIndex = -1;

  function select(index) {
    selectedIndex = index;
    const item = model.items[index];
    target.y = -Math.atan2(item.position.x, item.position.z);
    target.x = Math.atan2(item.position.y, Math.hypot(item.position.x, item.position.z)) * 0.82;

    trajectories.forEach((trajectory, groupIndex) => {
      const active = groupIndex === item.groupIndex;
      trajectory.material.opacity = active ? 0.62 : 0.1;
    });
    nodeMeshes.forEach((mesh, nodeIndex) => {
      const active = nodeIndex === index;
      const peer = model.items[nodeIndex].groupIndex === item.groupIndex;
      mesh.material.opacity = active ? 1 : peer ? 0.75 : 0.28;
      mesh.userData.baseScale = active ? 2.15 : peer ? 1.25 : 0.82;
    });
  }

  function tick(time, delta, interaction, reducedMotion) {
    if (selectedIndex >= 0) {
      orientation.x += (target.x - orientation.x) * Math.min(1, delta * 0.0022);
      orientation.y += (target.y - orientation.y) * Math.min(1, delta * 0.0022);
    } else if (!reducedMotion) {
      orientation.y += delta * 0.000055;
    }

    orientation.y += interaction.dragX;
    orientation.x += interaction.dragY;
    interaction.dragX = 0;
    interaction.dragY = 0;
    orientation.x = THREE.MathUtils.clamp(orientation.x, -1.05, 1.05);
    root.rotation.set(orientation.x, orientation.y, 0);

    camera.position.x += ((interaction.parallaxX * 0.14) - camera.position.x) * 0.045;
    camera.position.y += ((-interaction.parallaxY * 0.11) - camera.position.y) * 0.045;
    camera.lookAt(0, 0, 0);

    trajectories.forEach((trajectory, groupIndex) => {
      trajectory.particles.forEach((particle, particleIndex) => {
        const speed = reducedMotion ? 0 : time * (0.000025 + groupIndex * 0.000004);
        const angle = TAU * (particle.userData.phase + speed + particleIndex * 0.017);
        particle.position.set(
          Math.cos(angle) * trajectory.radius,
          0,
          Math.sin(angle) * trajectory.radius * trajectory.yScale,
        );
      });
    });

    nodeMeshes.forEach((mesh) => {
      mesh.scale.setScalar(mesh.userData.baseScale);
    });

    renderer.render(scene, camera);
  }

  const world = new THREE.Vector3();
  function projectNodes() {
    return nodeMeshes.map((mesh) => {
      mesh.getWorldPosition(world);
      const projected = world.clone().project(camera);
      return {
        x: (projected.x * 0.5 + 0.5) * container.clientWidth,
        y: (-projected.y * 0.5 + 0.5) * container.clientHeight,
        depth: projected.z,
      };
    });
  }

  function resize(width, height) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function destroy() {
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { tick, select, projectNodes, resize, destroy };
}
