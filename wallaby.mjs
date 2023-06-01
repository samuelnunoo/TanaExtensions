export default function (wallaby) {
    return {
        files: [
            'package.json',
            'tsconfig.json',
            'packages/**/*.ts',
            '!packages/**/*.spec.ts'
        ],
        setup

        tests: [
            'packages/**/*.spec.ts'
        ],

        env: {
            type: 'node',
            params: {
                runner: '--experimental-vm-modules'
            }
        },

        testFramework: 'ava'
    };
};