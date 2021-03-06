setwd('/Users/yoshimori/Desktop/Magisterka/New/CloudFunctionOptimizer/plots')
library('ggplot2')
csv = read.table("./data/all_results_2.csv",header = TRUE)
x <- csv$time
y <- csv$price
head(iris)
head(csv)
ggplot(csv, aes(x=time, y=price, color=as.factor(function.), shape=type)) +
  geom_point()  + labs(x = "Time", y="Cost", color="Allocated memory", shape="Execution type") +
  scale_shape_discrete(name="Type of cost and time", breaks=c("limit", "real", "sdbws"), labels=c("Limit", "Real", "Planned")) +
  theme(axis.title=element_text(size=24)) + theme(axis.text.y = element_text(size=18)) + 
  theme (axis.text.x = element_text(size=18)) + 
  theme(legend.text = element_text(size = 18), legend.title = element_text(size = 18)) + geom_point(size=5)
