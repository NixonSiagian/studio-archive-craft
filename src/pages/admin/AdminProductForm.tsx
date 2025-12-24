import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2, ArrowUp, ArrowDown, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';

interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
}

interface ProductFormData {
  name: string;
  slug: string;
  price_idr: number;
  drop: string;
  category: string;
  color: string;
  availability_label: string;
  description_lines: string[];
  sizes: string[];
  stock_by_size: Record<string, number>;
  is_active: boolean;
}

const DEFAULT_FORM_DATA: ProductFormData = {
  name: '',
  slug: '',
  price_idr: 299000,
  drop: 'archive-001',
  category: 'tee',
  color: 'Black',
  availability_label: 'Limited Run',
  description_lines: ['Premium cotton construction', 'Screen printed graphics', 'Produced once — No restock'],
  sizes: ['S', 'M', 'L', 'XL'],
  stock_by_size: { S: 10, M: 10, L: 10, XL: 10 },
  is_active: false,
};

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<ProductFormData>(DEFAULT_FORM_DATA);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch existing product
  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      if (isNew) return null;

      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (productError) throw productError;
      if (!productData) throw new Error('Product not found');

      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('sort_order', { ascending: true });

      return { ...productData, images: imagesData || [] };
    },
    enabled: !isNew,
  });

  // Initialize form when product loads
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        price_idr: product.price_idr,
        drop: product.drop,
        category: product.category,
        color: product.color,
        availability_label: product.availability_label,
        description_lines: product.description_lines || [],
        sizes: product.sizes || [],
        stock_by_size: (product.stock_by_size as Record<string, number>) || {},
        is_active: product.is_active,
      });
      setImages(product.images || []);
    }
  }, [product]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle form field changes
  const updateField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // Auto-generate slug when name changes
  const handleNameChange = (name: string) => {
    updateField('name', name);
    if (isNew || !product) {
      updateField('slug', generateSlug(name));
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const productId = isNew ? 'temp' : id;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        setImages((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}-${i}`,
            image_url: publicUrl,
            sort_order: prev.length + 1,
          },
        ]);
      }
      setHasChanges(true);
      toast.success('Images uploaded');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Move image up/down
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    newImages.forEach((img, i) => (img.sort_order = i + 1));
    setImages(newImages);
    setHasChanges(true);
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  // Handle description lines
  const addDescriptionLine = () => {
    updateField('description_lines', [...formData.description_lines, '']);
  };

  const updateDescriptionLine = (index: number, value: string) => {
    const newLines = [...formData.description_lines];
    newLines[index] = value;
    updateField('description_lines', newLines);
  };

  const removeDescriptionLine = (index: number) => {
    updateField('description_lines', formData.description_lines.filter((_, i) => i !== index));
  };

  // Handle stock by size
  const updateStock = (size: string, value: number) => {
    updateField('stock_by_size', { ...formData.stock_by_size, [size]: value });
  };

  // Save product mutation
  const saveProduct = useMutation({
    mutationFn: async () => {
      let productId = id;

      if (isNew) {
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: formData.name,
            slug: formData.slug,
            price_idr: formData.price_idr,
            drop: formData.drop,
            category: formData.category,
            color: formData.color,
            availability_label: formData.availability_label,
            description_lines: formData.description_lines,
            sizes: formData.sizes,
            stock_by_size: formData.stock_by_size,
            is_active: formData.is_active,
          })
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
      } else {
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            slug: formData.slug,
            price_idr: formData.price_idr,
            drop: formData.drop,
            category: formData.category,
            color: formData.color,
            availability_label: formData.availability_label,
            description_lines: formData.description_lines,
            sizes: formData.sizes,
            stock_by_size: formData.stock_by_size,
            is_active: formData.is_active,
          })
          .eq('id', id);

        if (error) throw error;
      }

      // Handle images
      if (!isNew) {
        // Delete existing images
        await supabase.from('product_images').delete().eq('product_id', productId);
      }

      // Insert new images
      if (images.length > 0) {
        const imageInserts = images.map((img, index) => ({
          product_id: productId,
          image_url: img.image_url,
          sort_order: index + 1,
        }));

        const { error: imgError } = await supabase.from('product_images').insert(imageInserts);
        if (imgError) throw imgError;
      }

      return productId;
    },
    onSuccess: (savedId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product', savedId] });
      setHasChanges(false);
      toast.success('Product saved successfully');
      if (isNew) {
        navigate(`/admin/products/${savedId}`, { replace: true });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save product');
    },
  });

  if (isLoading && !isNew) {
    return (
      <AdminLayout title="Loading...">
        <div className="text-muted-foreground text-sm">Loading product...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isNew ? 'New Product' : `Edit: ${formData.name}`}>
      <title>{isNew ? 'New Product' : formData.name} — WNM Admin</title>

      {/* Back button */}
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <section className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. ANT MAN TEE"
                  className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="e.g. ant-man-tee"
                  className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Price (IDR) *</label>
                  <input
                    type="number"
                    value={formData.price_idr}
                    onChange={(e) => updateField('price_idr', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Drop *</label>
                  <input
                    type="text"
                    value={formData.drop}
                    onChange={(e) => updateField('drop', e.target.value)}
                    placeholder="e.g. archive-001"
                    className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    placeholder="e.g. tee, hoodie"
                    className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => updateField('color', e.target.value)}
                    placeholder="e.g. Black, Off-white"
                    className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Availability Label</label>
                <input
                  type="text"
                  value={formData.availability_label}
                  onChange={(e) => updateField('availability_label', e.target.value)}
                  placeholder="e.g. Limited Run, No Restock"
                  className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Product Images
            </h2>

            {/* Image Upload */}
            <label className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-border hover:border-foreground transition-colors cursor-pointer mb-6">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {uploading ? 'Uploading...' : 'Click to upload images'}
              </span>
            </label>

            {/* Image List */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={img.id} className="relative group">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={img.image_url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 text-xs bg-foreground text-background px-2 py-1">
                        PRIMARY
                      </span>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button
                          onClick={() => moveImage(index, 'up')}
                          className="p-1 bg-background border border-border hover:bg-muted"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button
                          onClick={() => moveImage(index, 'down')}
                          className="p-1 bg-background border border-border hover:bg-muted"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(index)}
                        className="p-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Description Lines */}
          <section className="border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
                Description Lines
              </h2>
              <button
                onClick={addDescriptionLine}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-3 h-3" />
                Add Line
              </button>
            </div>

            <div className="space-y-3">
              {formData.description_lines.map((line, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => updateDescriptionLine(index, e.target.value)}
                    placeholder={`Line ${index + 1}`}
                    className="flex-1 px-4 py-2 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                  <button
                    onClick={() => removeDescriptionLine(index)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Sizes and Stock */}
          <section className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Sizes & Stock
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.sizes.map((size) => (
                <div key={size}>
                  <label className="text-xs text-muted-foreground mb-2 block">{size}</label>
                  <input
                    type="number"
                    value={formData.stock_by_size[size] || 0}
                    onChange={(e) => updateStock(size, parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-4 py-2 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Status */}
        <div className="space-y-6">
          <section className="border border-border p-6 sticky top-8">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Publish
            </h2>

            <div className="flex items-center justify-between mb-6">
              <span className="text-sm">Active (Published)</span>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => updateField('is_active', checked)}
              />
            </div>

            <button
              onClick={() => saveProduct.mutate()}
              disabled={saveProduct.isPending || !formData.name || !formData.slug}
              className={`w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest transition-colors ${
                hasChanges && formData.name && formData.slug
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {saveProduct.isPending ? 'SAVING...' : isNew ? 'CREATE PRODUCT' : 'SAVE CHANGES'}
            </button>

            {hasChanges && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                You have unsaved changes
              </p>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductForm;
