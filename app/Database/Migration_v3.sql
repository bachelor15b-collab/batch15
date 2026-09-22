-- CS15 Hub — Migration v3: Challenge image & link fields

ALTER TABLE challenges
  ADD COLUMN image_url VARCHAR(500) NULL AFTER xp_reward,
  ADD COLUMN link_url  VARCHAR(500) NULL AFTER image_url;
