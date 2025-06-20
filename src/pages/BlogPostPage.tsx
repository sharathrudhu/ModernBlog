import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ReadingProgressTimeline } from '@/components/blog/ReadingProgressTimeline';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { blogPosts } from '@/data/blogData';
import { format } from 'date-fns';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const currentUrl = window.location.href;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </Button>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              {post.featured && (
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">{post.author.bio}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>

              <div className="sm:ml-auto">
                <ShareButtons title={post.title} url={currentUrl} />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="px-4">
        <div className="container mx-auto">
          <div className="aspect-[21/9] overflow-hidden rounded-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content with Reading Progress */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex gap-12">
            {/* Main Content */}
            <article className="flex-1 max-w-4xl">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h1:text-3xl prose-h1:mb-6
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-muted prose-pre:border
                  prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-6
                  prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                  prose-li:marker:text-primary"
                dangerouslySetInnerHTML={{ __html: post.content.split('\n').map(line => {
                  if (line.startsWith('# ')) {
                    return `<h1>${line.slice(2)}</h1>`;
                  } else if (line.startsWith('## ')) {
                    return `<h2>${line.slice(3)}</h2>`;
                  } else if (line.startsWith('### ')) {
                    return `<h3>${line.slice(4)}</h3>`;
                  } else if (line.startsWith('- ')) {
                    return `<li>${line.slice(2)}</li>`;
                  } else if (line.trim() === '') {
                    return '<br>';
                  } else if (line.match(/^\d+\./)) {
                    return `<li>${line.replace(/^\d+\.\s*/, '')}</li>`;
                  } else if (line.startsWith('```')) {
                    return line.includes('```') && line !== '```' ? `<code>${line.slice(3, -3)}</code>` : line === '```' ? '' : line;
                  } else {
                    return `<p>${line}</p>`;
                  }
                }).join('')}}
              />
            </article>

            {/* Reading Progress Timeline - Desktop Only */}
            <aside className="hidden xl:block">
              <ReadingProgressTimeline readingTime={post.readingTime} />
            </aside>
          </div>
        </div>
      </section>

      {/* Author Bio */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-background rounded-lg p-8 shadow-sm border">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Avatar className="w-20 h-20">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback className="text-xl">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">About {post.author.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {post.author.bio}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  {post.author.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://twitter.com/${post.author.twitter.slice(1)}`} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {post.author.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://linkedin.com/in/${post.author.linkedin}`} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts
              .filter(p => p.id !== post.id)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group block"
                >
                  <article className="space-y-4">
                    <div className="aspect-[16/10] overflow-hidden rounded-lg">
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline">{relatedPost.category}</Badge>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{format(new Date(relatedPost.publishedAt), 'MMM d, yyyy')}</span>
                        <span>{relatedPost.readingTime} min read</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}