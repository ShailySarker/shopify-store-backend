const Customer = require("../models/customerModel");
const Order = require("../models/orderModels");
const { getGroupByFormat } = require("../helpers/getGroupByFormat");
const { intervalSchema } = require("../schemaValidator/intervalSV");

// 3. New Customers Added Over Time:
const getNewCustomersOverTime = async (req, res) => {
    try {
        //validation
        const { error, value } = intervalSchema.validate(req.query);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        const { interval } = value;

        const groupByFormat = getGroupByFormat(interval);

        const customers = await Customer.aggregate([
            {
                // Convert 'created_at' to a Date type
                $addFields: {
                    createdAtDate: {
                        $dateFromString: {
                            dateString: "$created_at",
                        },
                    },
                },
            },
            {
                // Group by the specified interval and count new customers
                $group: {
                    _id: {
                        $dateToString: { format: groupByFormat, date: "$createdAtDate" },
                    },
                    newCustomers: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        res.status(200).json({
            success: true,
            data: customers,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// 4. Number of Repeat Customers:
const getRepeatCustomers = async (req, res) => {
    try {
        //validation
        const { error, value } = intervalSchema.validate(req.query);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        const { interval } = value;
        const groupByFormat = getGroupByFormat(interval);

        // Aggregation pipeline
        const repeatCustomers = await Order.aggregate([
            {
                // Convert 'created_at' to a Date type
                $addFields: {
                    createdAtDate: {
                        $dateFromString: {
                            dateString: "$created_at",
                        },
                    },
                },
            },
            {
                // Group by customer ID and time interval, count orders
                $group: {
                    _id: {
                        customer_id: "$customer.id",
                        time_interval: {
                            $dateToString: { format: groupByFormat, date: "$createdAtDate" },
                        },
                    },
                    orderCount: { $sum: 1 },
                },
            },
            {
                // Filter for customers with more than one order
                $match: { orderCount: { $gt: 1 } },
            },
            {
                // Group by time interval and count unique customers
                $group: {
                    _id: "$_id.time_interval",
                    repeatCustomerCount: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        res.status(200).json({
            success: true,
            data: repeatCustomers,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// 5. Geographical Distribution of Customers:
const getGeographicalDistribution = async (req, res) => {
    try {
        const distribution = await Customer.aggregate([
            {
                // Project relevant fields
                $project: {
                    city: "$default_address.city",
                },
            },
            {
                // Group by city and count customers
                $group: {
                    _id: "$city",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        res.status(200).json({
            success: true,
            data: distribution,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// 6. Customer Lifetime Value by Cohorts:
const getCLVByCohort = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $addFields: {
          first_purchase_date: {
            $dateFromString: { dateString: "$customer.created_at" },
          },
          order_date: { $dateFromString: { dateString: "$created_at" } },
          total_price: { $toDouble: "$total_line_items_price" },
        },
      },
      {
        $addFields: {
          first_purchase_month: {
            $dateToString: { format: "%Y-%m", date: "$first_purchase_date" },
          },
          order_month: {
            $dateToString: { format: "%Y-%m", date: "$order_date" },
          },
        },
      },
      {
        $group: {
          _id: {
            cohort: "$first_purchase_month",
            order_month: "$order_month",
          },
          total_clv: { $sum: "$total_price" },
        },
      },
      {
        $group: {
          _id: "$_id.cohort",
          monthly_clv: {
            $push: {
              month: "$_id.order_month",
              clv: "$total_clv",
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching CLV by cohorts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
    getNewCustomersOverTime,
    getRepeatCustomers,
    getGeographicalDistribution,
    getCLVByCohort,
};
