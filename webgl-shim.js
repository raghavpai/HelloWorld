// Enable WEBGL_debug_renderer_info (if available) and avoid console errors
// when libraries query UNMASKED_VENDOR_WEBGL / UNMASKED_RENDERER_WEBGL
// without the extension enabled.
(function () {
  const UNMASKED_VENDOR_WEBGL = 0x9245;   // WEBGL_debug_renderer_info.UNMASKED_VENDOR_WEBGL
  const UNMASKED_RENDERER_WEBGL = 0x9246; // WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL

  function patchContext(gl) {
    if (!gl || gl._debugRendererInfoPatched) return gl;
    try {
      // Try enabling the extension. Returns null if not supported/disabled.
      gl.getExtension('WEBGL_debug_renderer_info');
    } catch (_) {}

    const originalGetParameter = gl.getParameter.bind(gl);
    gl.getParameter = function (pname) {
      try {
        return originalGetParameter(pname);
      } catch (e) {
        // If extension is not enabled, querying these enums throws INVALID_ENUM.
        if (pname === UNMASKED_VENDOR_WEBGL || pname === UNMASKED_RENDERER_WEBGL) {
          return null;
        }
        throw e;
      }
    };

    gl._debugRendererInfoPatched = true;
    return gl;
  }

  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    const ctx = originalGetContext.call(this, type, attrs);
    const t = typeof type === 'string' ? type.toLowerCase() : '' + type;
    if (t.includes('webgl')) {
      return patchContext(ctx);
    }
    return ctx;
  };
})();

