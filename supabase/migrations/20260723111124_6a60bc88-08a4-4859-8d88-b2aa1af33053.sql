
CREATE POLICY "Anyone can upload onboarding files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'onboarding-uploads');
