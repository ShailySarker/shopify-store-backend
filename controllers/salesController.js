const Order = require("../models/orderModels");
const { getGroupByFormat } = require("../helpers/getGroupByFormat");
const { intervalSchema } = require("../schemaValidator/intervalSV");


// 1. Total Sales Over Time
const getTotalSalesOverTime = async (req, res) => {
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

    const sales = await Order.aggregate([
      {
        $addFields: {
          total_price_num: {
            $toDouble: "$total_price",
          },
          createdAtDate: {
            $dateFromString: {
              dateString: "$created_at",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupByFormat, date: "$createdAtDate" },
          },
          totalSales: { $sum: "$total_price_num" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(sales);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// 2. Sales Growth Rate Over Time
const getSalesGrowthRateOverTime = async (req, res) => {
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
    const sales = await Order.aggregate([
      {
        $addFields: {
          total_price_num: {
            $toDouble: "$total_price",
          },
          createdAtDate: {
            $dateFromString: {
              dateString: "$created_at",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupByFormat, date: "$createdAtDate" },
          },
          totalSales: { $sum: "$total_price_num" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Calculate growth rates
    const salesWithGrowthRate = sales.map((current, index, array) => {
      if (index === 0) {
        return {
          ...current,
          growthRate: 0,
        };
      }

      const previous = array[index - 1];
      const growthRate =
        previous.totalSales === 0
          ? 0
          : ((current.totalSales - previous.totalSales) / previous.totalSales) *
            100;

      return {
        ...current,
        growthRate: growthRate.toFixed(2),
      };
    });

    res.status(200).json({
      success: true,
      data: salesWithGrowthRate,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  getTotalSalesOverTime,
  getSalesGrowthRateOverTime,
};
