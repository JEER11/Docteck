// Stripe configuration for frontend
// Prefer env, fallback to the existing test key for convenience in dev
export const STRIPE_PUBLISHABLE_KEY =
	(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY && process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY.trim()) ||
	"pk_test_51RqD5DBIiV5Xgt85lTFzKI3ramcgjVOiiEmEv2fWG2zFtwNOAXTilFANfIQ8Uqy8UpG1k6KZOpvYU7WJnmmhINsA00oBlYcyHj";
