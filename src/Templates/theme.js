///////////////////////////////////////////////////////////////
// Company

export const COMPANY = {
    name: "Pathwise",
    slogan: "Learn • Grow • Achieve",
    supportEmail: "support@pathwise.com",
    website: "https://pathwise.com",
};

///////////////////////////////////////////////////////////////
// Color Palette

export const COLORS = {
    // Brand
    primary: "#7C4DFF",
    primaryDark: "#6D3EF5",
    secondary: "#27C9FF",

    // Status
    success: "#16A34A",
    warning: "#D97706",
    danger: "#DC2626",

    // Backgrounds
    background: "#F8FAFC",
    surface: "#FFFFFF",

    // Borders
    border: "#E2E8F0",

    // Text
    textPrimary: "#1E293B",
    textSecondary: "#64748B",
    textLight: "#FFFFFF",
};

///////////////////////////////////////////////////////////////
// Typography

export const TYPOGRAPHY = {
    fontFamily: "Arial, Helvetica, sans-serif",

    heading: {
        fontSize: "28px",
        fontWeight: "700",
        lineHeight: "36px",
    },

    subHeading: {
        fontSize: "20px",
        fontWeight: "600",
        lineHeight: "28px",
    },

    body: {
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "26px",
    },

    small: {
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "22px",
    },
};

///////////////////////////////////////////////////////////////
// Spacing

export const SPACING = {
    xs: "8px",
    sm: "12px",
    md: "20px",
    lg: "32px",
    xl: "48px",
};

///////////////////////////////////////////////////////////////
// Border Radius

export const RADIUS = {
    sm: "6px",
    md: "10px",
    lg: "14px",
};

///////////////////////////////////////////////////////////////
// Email Layout

export const LAYOUT = {
    maxWidth: "600px",
};

///////////////////////////////////////////////////////////////
// Button

export const BUTTON = {
    height: "48px",
    radius: "8px",
};

///////////////////////////////////////////////////////////////
// Logo

export const LOGO = {
    width: "170px",
};

///////////////////////////////////////////////////////////////
// Info Box Types

export const INFO_BOX_TYPES = {
    DEFAULT: "default",
    SUCCESS: "success",
    WARNING: "warning",
    DANGER: "danger",
};

///////////////////////////////////////////////////////////////
// Info Box Variants

export const INFO_BOX_VARIANTS = {
    [INFO_BOX_TYPES.DEFAULT]: {
        background: "#F8FAFC",
        border: "#E2E8F0",
        text: "#475569",
    },

    [INFO_BOX_TYPES.SUCCESS]: {
        background: "#F0FDF4",
        border: "#BBF7D0",
        text: "#15803D",
    },

    [INFO_BOX_TYPES.WARNING]: {
        background: "#FFFBEB",
        border: "#FDE68A",
        text: "#B45309",
    },

    [INFO_BOX_TYPES.DANGER]: {
        background: "#FEF2F2",
        border: "#FECACA",
        text: "#B91C1C",
    },
};
