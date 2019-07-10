const needKey = false
const url = {
    VoteMpAdminUser: [
        'AddVoteMpAdminUser',
        'DelVoteMpAdminUser',
        'GetVoteMpAdminUserList',
        'Login',
        'ResetVoteMpAdminUserPassword',
        'UpdateVoteMpAdminUserPassword',
        'UpdateVoteMpAdminUser',
        'UpdateVoteMpAdminUserStatus',
        'GetVoteMpAdminUserInfo'
    ],
    VoteMpNews: [
        'AddVoteMpNews',
        'DelVoteMpNews',
        'GetVoteMpNewsList',
        'UpdateVoteMpNews',
        'UpdateVoteMpNewsShow',
        'UpdateVoteMpNewsTop'
    ],
    VoteMpUser: [
        'AddVoteMpUser',
        'DelVoteMpUser',
        'GetVoteMpUserList',
        'UpdateVoteMpUser',
        'UpdateVoteMpUserMoney',
        'ResetVoteMpUserPassword',
        'UpdateVoteMpUserStatus'
    ],
    Activity: ['GetActivityList', 'UpdateActivity', 'UpdateActivityShow'],
    Captcha: [
        'GetImageCaptcha',
        'VerifyImageCaptcha',
        'GetSmsCaptcha',
        'VerifySmsCaptcha'
    ],
    VoteItem: ['GetVoteItemGroupList', 'GetVoteItemList'],
    VoteMpConf: [
        'GetVoteMpBasicConf',
        'GetVoteMpRechargeConf',
        'UpdateVoteMpBasicConf',
        'UpdateVoteMpRechargeConf'
    ],
    VoteMpFinancialDetail: ['GetVoteMpFinancialDetailList'],
    VoteMpRechargeLog: ['GetVoteMpRechargeLogList'],
    VoteMpUserLog: ['GetVoteMpUserLogList'],
    VoteOrder: [
        'GetVoteOrderList',
        'GetVoteOrder',
        'GetVoteTaskItemList',
        'PlaceVoteOrder',
        'RefundVoteOrder',
        'UpdateVoteOrder'
    ]
}
const axiosUrl = []
for (const key in url) {
    url[key].forEach(val => {
        const obj = {
            url: `/${key}/${val}`,
            name: needKey ? key + val : val
        }
        axiosUrl.push(obj)
    })
}
export default axiosUrl
