-- Seed data
INSERT INTO "user" (id, name, email, created_at, updated_at) VALUES ('8fb204cb-55c4-48d7-a9b1-59727d613df6', 'Admin', 'admin@example.local', 1774790692832, 1774790692832);
INSERT INTO "user" (id, name, email, created_at, updated_at) VALUES ('262eb794-3167-49b0-a0d9-5b9faf9a48f3', 'Alice', 'alice@example.com', 1774790692832, 1774790692832);
INSERT INTO "user" (id, name, email, created_at, updated_at) VALUES ('1aecbd7d-9983-4a56-ad08-6eb0628e7156', 'Bob', 'bob@example.com', 1774790692832, 1774790692832);
INSERT INTO "organization" (id, name, slug, created_at) VALUES ('9516b200-dc48-45e5-a64d-247151cf2e60', 'My Organization', 'my-org', 1774790692832);
INSERT INTO "member" (id, user_id, organization_id, role, created_at) VALUES ('f40be349-2a83-4e3a-b51b-66e4fd79d03d', '8fb204cb-55c4-48d7-a9b1-59727d613df6', '9516b200-dc48-45e5-a64d-247151cf2e60', 'owner', 1774790692832);
INSERT INTO "member" (id, user_id, organization_id, role, created_at) VALUES ('a1cea80f-8580-4b8f-a5a8-714ceb1d8609', '262eb794-3167-49b0-a0d9-5b9faf9a48f3', '9516b200-dc48-45e5-a64d-247151cf2e60', 'member', 1774790692832);
INSERT INTO "member" (id, user_id, organization_id, role, created_at) VALUES ('2e5d94af-16b6-4804-9a32-84b3b07c0328', '1aecbd7d-9983-4a56-ad08-6eb0628e7156', '9516b200-dc48-45e5-a64d-247151cf2e60', 'member', 1774790692832);
