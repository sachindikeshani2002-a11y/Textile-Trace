import tseslint from 'typescript-eslint';
export default tseslint.config({ignores:['dist/**','backend/dist/**','backend/node_modules/**']},...tseslint.configs.recommended,{rules:{'@typescript-eslint/no-explicit-any':'off','@typescript-eslint/no-unused-vars':'off'}});
