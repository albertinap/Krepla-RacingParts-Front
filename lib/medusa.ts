import Medusa from "@medusajs/js-sdk"

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
  publishableKey: "pk_9fb79533c0b334820e6296a8cb165fe05650abb75be4d87f944d76fc77d28910",
})