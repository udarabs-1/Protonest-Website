// next-sitemap.config.js
const lockedFolders = process.env.LOCKED_FOLDERS ?
    process.env.LOCKED_FOLDERS.split(',').map(folder => `/${folder.trim()}/*`) :
    [];

module.exports = {
    siteUrl: 'https://protonest.co',
    generateRobotsTxt: true,
    exclude: [
        '/server-sitemap.xml',
        ...lockedFolders,
    ],
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
            { userAgent: '*', disallow: '/private/' },
            // Dynamically add disallow rules for locked folders
            ...lockedFolders.map(folder => ({
                userAgent: '*',
                disallow: folder
            })),
        ],
    },
};