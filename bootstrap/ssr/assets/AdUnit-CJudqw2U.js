import { jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import axios from "axios";
function AdUnit({ ad }) {
  if (!ad || !ad.is_active) return null;
  useEffect(() => {
    axios.post(`/ads/${ad.id}/impression`).catch((e) => console.error("Ad tracking blocked:", e));
    if (ad.provider === "adsense" && ad.client_id && ad.slot_id) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [ad]);
  if (ad.provider === "custom" && ad.custom_code) {
    return /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: ad.custom_code } });
  }
  if (ad.provider === "facebook" && ad.slot_id) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "fb-ad",
        "data-placementid": ad.slot_id,
        "data-format": ad.format === "auto" ? "native" : ad.format,
        "data-nativeadid": ad.client_id
      }
    );
  }
  if (ad.provider === "adsense") {
    return /* @__PURE__ */ jsx("div", { className: "w-full overflow-hidden text-center my-4", children: /* @__PURE__ */ jsx(
      "ins",
      {
        className: "adsbygoogle",
        style: { display: "block" },
        "data-ad-client": ad.client_id,
        "data-ad-slot": ad.slot_id,
        "data-ad-format": ad.format,
        "data-full-width-responsive": "true"
      }
    ) });
  }
  return null;
}
export {
  AdUnit as A
};
