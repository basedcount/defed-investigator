export type Software = 'lemmy' | 'mastodon' | 'pleroma' | 'akkoma' | 'mbin' | 'misskey';

//Instances with less than "users" monthly active users aren't queried (limits number of requests)
export const softwareList = [
    {
        name: 'lemmy',
        users: 2
    },
    {
        name: 'mastodon',
        users: 20
    },
    {
        name: 'misskey',
        users: 2
    },
    {
        name: 'mbin',
        users: 2
    },
    {
        name: 'pleroma',
        users: 2
    },
    {
        name: 'akkoma',
        users: 2
    },
] satisfies { name: Software, users: number }[];