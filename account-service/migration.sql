-- Run this SQL script once to clean up the old customerID column
-- After running this, the Account table will only have userID column

-- First, copy data from customerID to userID (if userID doesn't have data)
UPDATE Account SET userID = customerID WHERE userID IS NULL;

-- Then drop the old customerID column
ALTER TABLE Account DROP COLUMN customerID;
