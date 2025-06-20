import { useParams, Navigate } from 'react-router-dom';
import { BlogCard } from '@/components/blog/BlogCard';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blogData';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  
  if (!category) {
    return <Navigate to="/" replace />;
  }

  const categoryPosts = blogPosts.filter(
    post => post.category.toLowerCase() === category.toLowerCase()
  );

  if (categoryPosts.length === 0) {
    return <Navigate to="/" replace />;
  }

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="container mx-auto">
        {/* Category Header */}
        <div className="mb-12">
          <Badge variant="secondary" className="mb-4">
            Category
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {categoryName}
          </h1>
          <p className="text-xl text-muted-foreground">
            {categoryPosts.length} article{categoryPosts.length !== 1 ? 's' : ''} in this category
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {categoryPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}