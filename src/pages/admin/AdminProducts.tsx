import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Copy, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatPrice } from '@/data/products';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  price_idr: number;
  drop: string;
  category: string;
  color: string;
  is_active: boolean;
  created_at: string;
  stock_by_size: Record<string, number>;
}

const AdminProducts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState('');
  const [dropFilter, setDropFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('products')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated');
    },
    onError: () => {
      toast.error('Failed to update product');
    },
  });

  const duplicateProduct = useMutation({
    mutationFn: async (product: Product) => {
      const newSlug = `${product.slug}-copy-${Date.now()}`;
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: `${product.name} (Copy)`,
          slug: newSlug,
          price_idr: product.price_idr,
          drop: product.drop,
          category: product.category,
          color: product.color,
          is_active: false,
          stock_by_size: product.stock_by_size,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product duplicated');
      navigate(`/admin/products/${data.id}`);
    },
    onError: () => {
      toast.error('Failed to duplicate product');
    },
  });

  const drops = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.drop))];
  }, [products]);

  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.slug.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (dropFilter !== 'all' && p.drop !== dropFilter) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (activeFilter === 'active' && !p.is_active) return false;
      if (activeFilter === 'inactive' && p.is_active) return false;
      return true;
    });
  }, [products, search, dropFilter, categoryFilter, activeFilter]);

  const getTotalStock = (stockBySize: Record<string, number>) => {
    return Object.values(stockBySize).reduce((sum, qty) => sum + qty, 0);
  };

  return (
    <AdminLayout title="Products">
      <title>Admin Products — WNM</title>

      {/* Actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        {/* Drop Filter */}
        <Select value={dropFilter} onValueChange={setDropFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Drop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Drops</SelectItem>
            {drops.map((drop) => (
              <SelectItem key={drop} value={drop}>
                {drop}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Active Filter */}
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Add New Button */}
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 border border-border">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Link to="/admin/products/new" className="btn-primary">
            ADD YOUR FIRST PRODUCT
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Drop</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-right">Price</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-center">Stock</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/10">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{product.drop}</TableCell>
                  <TableCell className="text-xs uppercase">{product.category}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatPrice(product.price_idr)}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {getTotalStock(product.stock_by_size)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/products/${product.id}`)}
                        className="p-2 hover:bg-muted/50 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateProduct.mutate(product)}
                        className="p-2 hover:bg-muted/50 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleActive.mutate({ id: product.id, is_active: !product.is_active })}
                        className="p-2 hover:bg-muted/50 transition-colors"
                        title={product.is_active ? 'Disable' : 'Enable'}
                      >
                        {product.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
