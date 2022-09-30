2022-09-30 ricc v0.7 Tried with `uniformBucketLevelAccess` buit it broke everything since I could not then set up the
                     per-object ACLs so I restored the good old way. I also disabled BUCKET publicness and just enabled
                     those 3 objects which seems googlier. I added a lot of garbage code which Im gonna clean up before
                     final release.
2022-09-30 ricc v0.6 Added `uniformBucketLevelAccess` to bucket. Now it should work alone, and refactored bucket vs
                     object access in two possibly exclusive booleans (fior now both true). Also moved bucket
                     to EU because why not. Diversity, right?
2022-09-30 ricc v0.5 Fixed the public IP for objects (making GCS bucket public wouldnt suffice)
2022-09-29 ricc v0.4 Created LB thanks to Roberto and make it work - apart from public state of objects

