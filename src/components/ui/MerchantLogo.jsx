import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * MerchantLogo displays a merchant logo if the URL resolves; otherwise it falls back to
 * an initial-based avatar. This avoids broken image icons when the mock logo URLs fail
 * and will seamlessly show the real logo when backend data provides one.
 */
export default function MerchantLogo({ src, name, size = 32, className = "" }) {
  const [errored, setErrored] = useState(false);
  const first = (name || "?").charAt(0).toUpperCase();

  if (!src || errored) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex-shrink-0 rounded-full bg-gray40 flex items-center justify-center text-black50 font-semibold ${className}`}
      >
        {first}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      onError={() => setErrored(true)}
      style={{ width: size, height: size }}
      className={`flex-shrink-0 rounded-full object-cover ${className}`}
    />
  );
}

MerchantLogo.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
};
