import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/types/blog';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const CardWrapper = featured ? 'div' : Card;
  
  return (
    <article className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg ${
      featured 
        ? 'bg-gradient-to-br from-background to-muted/50 border shadow-sm' 
        : ''
    }`}>
      <CardWrapper className={featured ? 'border-0 shadow-none bg-transparent' : undefined}>
        {/* Cover Image */}
        <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {post.featured && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          
          {/* Category Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-4 right-4 bg-background/90 text-foreground hover:bg-background"
          >
            {post.category}
          </Badge>
        </div>

        <CardHeader className={featured ? 'p-6' : undefined}>
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h2 className={`font-bold leading-tight group-hover:text-primary transition-colors ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}>
            <Link 
              to={`/blog/${post.slug}`}
              className="after:absolute after:inset-0"
            >
              {post.title}
            </Link>
          </h2>
        </CardHeader>

        <CardContent className={featured ? 'px-6' : undefined}>
          <p className={`text-muted-foreground leading-relaxed ${
            featured ? 'text-lg' : 'text-sm'
          }`}>
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className={`flex items-center justify-between ${featured ? 'px-6 pb-6' : ''}`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{post.author.name}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </CardFooter>

        {/* Read More Button for Featured Posts */}
        {featured && (
          <div className="px-6 pb-6">
            <Button asChild className="group/btn relative z-10">
              <Link to={`/blog/${post.slug}`}>
                Read Full Article
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </CardWrapper>
    </article>
  );
}