import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ req, token }) {
      const pathname = req.nextUrl.pathname;
      if (pathname.startsWith("/admin")) return token?.role === "ADMIN";
      return Boolean(token);
    },
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/courses/:path*",
    "/learning-paths/:path*",
    "/flashcards/:path*",
    "/reviews/:path*",
    "/simulations/:path*",
    "/certificates/:path*",
    "/admin/:path*",
  ],
};
