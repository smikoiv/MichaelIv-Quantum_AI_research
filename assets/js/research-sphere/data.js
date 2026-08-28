export function readSphereData(root) {
  const source = root.querySelector('[data-sphere-data]');
  if (!source) throw new Error('Research-sphere data is unavailable.');

  const parsed = JSON.parse(source.textContent);
  const palette = {
    theory: 0x71e1ff,
    research: 0xa897ff,
    applications: 0x74e6b2,
  };

  const items = parsed.groups.flatMap((group, groupIndex) =>
    group.items.map((item, itemIndex) => {
      const coordinates = item.sphere_coordinates;
      const length = Math.hypot(coordinates.x, coordinates.y, coordinates.z) || 1;

      return {
        ...item,
        group: group.key,
        groupIndex,
        itemIndex,
        color: palette[group.key],
        position: {
          x: coordinates.x / length,
          y: coordinates.y / length,
          z: coordinates.z / length,
        },
      };
    }),
  );

  return { groups: parsed.groups, items, palette };
}
