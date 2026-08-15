// next-sitemap.config.js
module.exports = {
    siteUrl: 'https://protonest.co',
    generateRobotsTxt: true,
    exclude: [
        '/server-sitemap.xml',
        '/incomplete/*',  // Exclude all incomplete pages from sitemap
        '/industries/access-control',  // Added via additionalPaths with custom priority/changefreq
    ],
    additionalPaths: async () => [
        {
            loc: 'https://www.protonest.co/industries/access-control',
            changefreq: 'monthly',
            priority: 0.9,
        },
    ],
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
            { userAgent: '*', disallow: '/private/' },
            { userAgent: '*', disallow: '/incomplete/*' }, // Block search engines
        ],
    },
};