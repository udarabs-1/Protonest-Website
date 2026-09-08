// next-sitemap.config.js
module.exports = {
    siteUrl: 'https://protonest.co',
    generateRobotsTxt: true,
    exclude: [
        '/server-sitemap.xml',
        '/incomplete/*',  // Exclude all incomplete pages from sitemap
        '/dashboard',
        '/dashboard/*',
        '/down',
        '/forgot-password',
        '/reset-password',
        '/signin',
        '/signup',
        '/submit-cv',
        '/unsubscribe',
        '/careers/opengraph-image.jpg',
        '/industries/access-control',  // Added via additionalPaths with custom priority/changefreq
    ],
    additionalPaths: async () => [
        {
            loc: 'https://protonest.co/industries/access-control',
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
