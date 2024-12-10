import moment from "moment";

const getAggregationStages = (type, dateField) => {
    let query = {
        matchStage: { $match: {} },
        groupStage: {
            _id: {
                // month: { $month: `$${dateField}` },
                label: { $dateToString: { format: "%B", date: `$${dateField}` } }, // Month name
            },
        },
    };

    switch (type) {
        case "7days":
            const startDate = moment().utc().subtract(7, "days").startOf("day").toDate();

            query = {
                matchStage: { $match: { [dateField]: { $gte: startDate, $lte: moment().utc().toDate() } } },
                groupStage: {
                    _id: {
                        sortId: { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` } },
                        label: { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` } },
                    },
                    label: { $dayOfMonth: `$${dateField}` },
                },
            };
            break;
        case "month":
            query = {
                matchStage: { $match: {} }, // No additional filter
                groupStage: {
                    _id: {
                        sortId: { $month: `$${dateField}` },
                        label: { $dateToString: { format: "%b", date: `$${dateField}` } }, // Month name
                    },
                },
            };
            break;
        case "year":
            query = {
                matchStage: { $match: {} }, // No additional filter
                groupStage: {
                    _id: {
                        sortId: { $year: `$${dateField}` },
                        label: { $dateToString: { format: "%Y", date: `$${dateField}` } },
                    },
                },
            };
            break;
    }

    return query;
};

export default getAggregationStages;
