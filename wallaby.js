export default function (wallaby) {
    return {
        files: [
            'package.json',
            'tsconfig.json',
            'packages/**/*.ts',
            '!packages/**/*.spec.ts'
        ],
        
        tests: [
            'packages/**/*.spec.ts'
        ],

        env: {
            type: 'node',
            params: {
              runner: '--experimental-specifier-resolution=node --experimental-vm-modules'
            }
          },
          
        testFramework: 'ava'
    };
};