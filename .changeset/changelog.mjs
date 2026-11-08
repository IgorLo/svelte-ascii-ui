export async function getReleaseLine(changeset) {
  return `- ${changeset.summary.trim().replace(/\n/g, '\n  ')}`;
}
export async function getDependencyReleaseLine() { return ''; }
