// next-sitemap.config.js
module.exports = {
    siteUrl: 'https://protonest.co',
    generateRobotsTxt: true,
    exclude: [
        '/server-sitemap.xml',
        '/incomplete/*',  // Exclude all incomplete pages from sitemap
    ],
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
            { userAgent: '*', disallow: '/private/' },
            { userAgent: '*', disallow: '/incomplete/*' }, // Block search engines
        ],
    },
};