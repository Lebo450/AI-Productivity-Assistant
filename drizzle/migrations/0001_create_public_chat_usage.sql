CREATE TABLE public.public_chat_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX public_chat_usage_ip_time_idx
  ON public.public_chat_usage (ip_hash, created_at);

GRANT ALL ON public.public_chat_usage TO service_role;

ALTER TABLE public.public_chat_usage ENABLE ROW LEVEL SECURITY;