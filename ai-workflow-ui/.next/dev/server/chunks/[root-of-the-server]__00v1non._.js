module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/ai-workflow-ui/app/api/leads/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ai$2d$workflow$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ai-workflow-ui/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(request) {
    try {
        const { city, businessType } = await request.json();
        if (!city || !businessType) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$ai$2d$workflow$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'City and Business Type are required'
            }, {
                status: 400
            });
        }
        console.log(`📡 Server hunting for ${businessType} in ${city}...`);
        // --- EXPANDED LOCAL DATABASE INDEX ---
        // A broader collection of local businesses across distinct industry niches
        const mockGooglePlacesDatabase = [
            // Contractors / Trades
            {
                name: "Apex Local Trades & Plumbing",
                phone: "(612) 555-0143",
                website: null,
                rating: 4.2,
                niche: "contractor"
            },
            {
                name: "Young America Landscaping",
                phone: "(612) 555-0177",
                website: null,
                rating: 4.0,
                niche: "contractor"
            },
            {
                name: "Midwest Roofing Specialists",
                phone: "(952) 555-0322",
                website: "https://midwestroof.com",
                rating: 4.6,
                niche: "contractor"
            },
            // Salons / Spas
            {
                name: "Downtown Nail Salon & Spa",
                phone: "(320) 555-0122",
                website: null,
                rating: 4.5,
                niche: "salon"
            },
            {
                name: "Elite Hair Design Studio",
                phone: "(612) 555-0988",
                website: null,
                rating: 4.8,
                niche: "salon"
            },
            {
                name: "Radiant Glow Skincare Lounge",
                phone: "(952) 555-0411",
                website: "https://radiantglow.com",
                rating: 4.4,
                niche: "salon"
            },
            // Restaurants / Cafes
            {
                name: "Norwood Bakery & Cafe",
                phone: "(952) 555-0188",
                website: "https://norwoodbakery.com",
                rating: 4.9,
                niche: "restaurant"
            },
            {
                name: "St. Cloud Deli & Grill",
                phone: "(320) 555-0761",
                website: null,
                rating: 4.1,
                niche: "restaurant"
            }
        ];
        // --- DYNAMIC PIPELINE FILTERS ---
        const cleanSearchQuery = businessType.trim().toLowerCase();
        const filteredLeads = mockGooglePlacesDatabase.filter((business)=>{
            // 1. Must match the user's specific business sector niche query string
            const matchesNiche = business.niche === cleanSearchQuery;
            // 2. Must be missing a domain listing completely (website column equals null)
            const isMissingWebsite = business.website === null;
            return matchesNiche && isMissingWebsite;
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$ai$2d$workflow$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            searchQuery: `${businessType} in ${city}`,
            totalFound: mockGooglePlacesDatabase.filter((b)=>b.niche === cleanSearchQuery).length,
            leadsGenerated: filteredLeads.length,
            leads: filteredLeads
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$ai$2d$workflow$2d$ui$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__00v1non._.js.map