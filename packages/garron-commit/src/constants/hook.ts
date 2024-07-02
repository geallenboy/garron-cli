export const HOOK = {
  CONTENTS:
    '#!/usr/bin/env sh\n# garron-commit as a commit hook\n' +
    'if npx -v >&/dev/null\n' +
    'then\n' +
    '  exec < /dev/tty\n  npx -c "garron-commit --hook $1 $2"\n' +
    'else\n' +
    '  exec < /dev/tty\n  garron-commit --hook $1 $2\n' +
    'fi',
  FILENAME: 'prepare-commit-msg',
  PERMISSIONS: 0o775,
};
