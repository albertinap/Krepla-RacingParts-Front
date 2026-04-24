export interface MappedProduct {
    id: string
    name: string
    handle: string
    price: number
    image: string
    brand: string
    category: string
    createdAt: Date
    colors: string[]
    inStock: boolean
    inventory_quantity: number
    manage_inventory: boolean
    variantId: string
  }
  
  export function mapProduct(p: any): MappedProduct {
    const variant = p.variants?.[0]
    const manageInventory = variant?.manage_inventory ?? false
    const inventoryQty = variant?.inventory_quantity ?? 0

    if (!variant?.id) {
        console.warn("[mapProduct] Producto sin variante:", p.title, p.id)
    }
  
    return {
      id: p.id,
      name: p.title,
      handle: p.handle,
      price: variant?.calculated_price?.calculated_amount
        ?? variant?.calculated_price?.original_amount
        ?? variant?.prices?.[0]?.amount
        ?? 0,
      image: p.thumbnail ?? "/placeholder.svg?height=300&width=300",
      brand: p.collection?.title ?? "Sin marca",
      category: p.categories?.[0]?.name ?? "",
      createdAt: new Date(p.created_at),
      colors: p.options
        ?.find((o: any) => o.title?.toLowerCase().includes("color"))
        ?.values?.map((v: any) => v.value) ?? [],
      inStock: !manageInventory || inventoryQty > 0,
      inventory_quantity: inventoryQty,
      manage_inventory: manageInventory,
      variantId: variant?.id,  // ← guardado directo
    }
  }
  
  export const PRODUCT_FIELDS = "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+collection,+images,+thumbnail"