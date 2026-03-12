-- Table to store petition signatures
CREATE TABLE signatures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table to store site settings (like the hero text)
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY, -- e.g., 'hero_headline', 'hero_subtitle'
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default site settings
INSERT INTO site_settings (id, value) VALUES
('hero_headline', 'Stop the Radical Redistricting Law in Virginia'),
('hero_subtitle', 'They are trying to pick their voters. We demand fair representation. Stand with us to stop partisan gerrymandering before it''s too late.')
ON CONFLICT (id) DO NOTHING;

-- Table to store blog posts
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) policies

-- Allow anyone to insert a signature, but not read them (protecting emails)
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert signatures" ON signatures FOR INSERT WITH CHECK (true);
CREATE POLICY "Only authenticated users can view signatures" ON signatures FOR SELECT USING (auth.role() = 'authenticated');

-- Allow anyone to read site settings, but only authenticated users can update
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can update settings" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow anyone to read published blog posts, but only authenticated users can do everything else
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can manage posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
