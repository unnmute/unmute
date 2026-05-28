(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/ssr/edge-wrapper_23c07f85.js",
"[project]/edge-wrapper.js { MODULE => \"[project]/node_modules/next/dist/esm/build/templates/edge-ssr-app.js { INNER_PAGE_ENTRY => \\\"[project]/node_modules/next/dist/esm/build/templates/app-page.js?page=/room/[emotion]/page { GLOBAL_ERROR_MODULE => \\\\\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-edge-rsc] (ecmascript, Next.js Server Component)\\\\\\\", MODULE_0 => \\\\\\\"[project]/app/layout.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)\\\\\\\", MODULE_1 => \\\\\\\"[project]/node_modules/next/dist/client/components/builtin/not-found.js [app-edge-rsc] (ecmascript, Next.js Server Component)\\\\\\\", MODULE_2 => \\\\\\\"[project]/node_modules/next/dist/client/components/builtin/forbidden.js [app-edge-rsc] (ecmascript, Next.js Server Component)\\\\\\\", MODULE_3 => \\\\\\\"[project]/node_modules/next/dist/client/components/builtin/unauthorized.js [app-edge-rsc] (ecmascript, Next.js Server Component)\\\\\\\", MODULE_4 => \\\\\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-edge-rsc] (ecmascript, Next.js Server Component)\\\\\\\", MODULE_5 => \\\\\\\"[project]/app/room/[emotion]/layout.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)\\\\\\\", MODULE_6 => \\\\\\\"[project]/app/room/[emotion]/loading.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)\\\\\\\", MODULE_7 => \\\\\\\"[project]/app/room/[emotion]/page.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)\\\\\\\" } [app-edge-rsc] (ecmascript)\\\" } [app-edge-rsc] (ecmascript)\" } [app-edge-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i('[project]/node_modules/next/dist/esm/build/templates/edge-ssr-app.js { INNER_PAGE_ENTRY => "[project]/node_modules/next/dist/esm/build/templates/app-page.js?page=/room/[emotion]/page { GLOBAL_ERROR_MODULE => \\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-edge-rsc] (ecmascript, Next.js Server Component)\\", MODULE_0 => \\"[project]/app/layout.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)\\", MODULE_1 => \\"[project]/node_modules/next/dist/client/components/builtin/not-found.js [app-edge-rsc] (ecmascript, Next.js Server Component)\\", MODULE_2 => \\"[project]/node_modules/next/dist/client/components/builtin/forbidden.js [app-edge-rsc] (ecmascript, Next.js Server Component)\\", MODULE_3 => \\"[project]/node_modules/next/dist/client/components/builtin/unauthorized.js [app-edge-rsc] (ecmascript, Next.js Server Component)\\", MODULE_4 => \\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-edge-rsc] (ecmascript, Next.js Server Component)\\", MODULE_5 => \\"[project]/app/room/[emotion]/layout.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)\\", MODULE_6 => \\"[project]/app/room/[emotion]/loading.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)\\", MODULE_7 => \\"[project]/app/room/[emotion]/page.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)\\" } [app-edge-rsc] (ecmascript)" } [app-edge-rsc] (ecmascript)'));
modProm.catch(()=>{});
self._ENTRIES["middleware_app/room/[emotion]/page"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}),
]);

//# sourceMappingURL=edge-wrapper_23c07f85.js.map