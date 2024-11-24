const tokens = {
  "sizes.icon": {
    "value": "44px",
    "variable": "var(--sizes-icon)"
  }
}

export function token(path, fallback) {
  return tokens[path]?.value || fallback
}

function tokenVar(path, fallback) {
  return tokens[path]?.variable || fallback
}

token.var = tokenVar