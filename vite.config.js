import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 800, // Increase the warning limit temporarily
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Put React and React Router in the vendor chunk
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router-dom")
          ) {
            return "vendor"
          }

          // Put Firebase in its own chunk
          if (id.includes("node_modules/firebase")) {
            return "firebase"
          }

          // Everything else goes in the default chunk
        },
      },
      // external: [
      //   // Externalize SendGrid-related modules that are meant for Node.js
      //   "@sendgrid/mail",
      //   "@sendgrid/helpers",
      // ],
    },
  },
  // optimizeDeps: {
  //   exclude: ["@sendgrid/mail", "@sendgrid/helpers"],
  // },
})

// import { defineConfig } from "vite"
// import react from "@vitejs/plugin-react"
// import path from "path"

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     port: 3000,
//   },
//   build: {
//     chunkSizeWarningLimit: 800, // Increase the warning limit temporarily
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ["react", "react-dom", "react-router-dom", "firebase/app", "firebase/auth", "firebase/firestore"],
//           // Split Firebase into its own chunk
//           firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"],
//         },
//       },
//       external: [
//         // Externalize SendGrid-related modules that are meant for Node.js
//         "@sendgrid/mail",
//         "@sendgrid/helpers",
//       ],
//     },
//   },
//   optimizeDeps: {
//     exclude: ["@sendgrid/mail", "@sendgrid/helpers"],
//   },
// })

