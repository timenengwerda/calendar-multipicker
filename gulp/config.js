module.exports = {
    'frontend': {
        dest: './frontend/dist',
        src: './frontend'
    },
    'backend': {
        dest: './src/Project.Web',
        src: './src/frontend'
    },

    // Default config mode is frontend,
    // can be changed to 'backend' to compile to project folders
    mode: 'frontend'
};
