-- Enable Row Level Security on all tables.
-- Prisma connects via DATABASE_URL as the postgres role (BYPASSRLS),
-- so all server-side queries continue to work unaffected.
-- This blocks direct REST API access via the anon/authenticated roles.

ALTER TABLE "SiteSettings"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HomeSettings"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AboutSettings"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SafeguardingSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Programme"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Story"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Report"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Career"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamMember"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Partner"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactSubmission"    ENABLE ROW LEVEL SECURITY;
