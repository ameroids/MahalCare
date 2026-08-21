# Supabase Setup for Doctors Directory

Please run the following SQL command in your Supabase SQL Editor to create the updated `doctors_directory` table:

```sql
DROP TABLE IF EXISTS doctors_directory;

CREATE TABLE doctors_directory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text,
  names text,
  type text,
  qualifications text,
  mobile_no text,
  time text,
  address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow public read access
CREATE POLICY "Allow public read access on doctors_directory" ON doctors_directory FOR SELECT USING (true);

-- Allow anon insert/update/delete 
CREATE POLICY "Allow anon insert access on doctors_directory" ON doctors_directory FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon delete access on doctors_directory" ON doctors_directory FOR DELETE USING (true);
CREATE POLICY "Allow anon update access on doctors_directory" ON doctors_directory FOR UPDATE USING (true);

-- Enable RLS
ALTER TABLE doctors_directory ENABLE ROW LEVEL SECURITY;
```
