setwd('/Users/yoshimori/Studyspace/Magisterka/CloudFunctionOptimizer')
library('ggplot2')

sdbws_results = read.table("./results_without_request_duration/ellipsoids/100/sdbws_x5/results/step4/sdbws-AWS_256_512_1024_1536_2048_2560_3008x5/average_execution.csv",header = TRUE)
sdbcs_results = read.table("./results_without_request_duration/ellipsoids/100/sdbcs_x5/results/step4/sdbcs-AWS_256_512_1024_1536_2048_2560_3008x5/average_execution.csv",header = TRUE)

# sdbws_results = read.table("./results_without_request_duration/montage/0.25/sdbws/step4/sdbws-montage_AWS_256_512_1024_1536_2048_2560_3008x5/average_execution.csv",header = TRUE)
# sdbcs_results = read.table("./results_without_request_duration/montage/0.25/sdbcs/step4/sdbcs-montage_AWS_256_512_1024_1536_2048_2560_3008x5/average_execution.csv",header = TRUE)

sdbws_results = sdbws_results[order(sdbws_results$id),]
sdbws_results$algorithm <- "sdbws"

sdbcs_results = sdbcs_results[order(sdbcs_results$id),]
sdbcs_results$algorithm <- "sdbcs"

results <- rbind(sdbws_results, sdbcs_results)
ggplot(results, aes(x=id, y=time, group = type, colour=as.factor(algorithm), shape=as.factor(algorithm))) + geom_point(size=4) + theme(axis.text.x = element_text(angle = 90, hjust = 1)) + guides(shape = FALSE) + labs(x = "Task ID", y = "Time in ms", colour = "Algorithm") + ylim(0, 10000) + theme(plot.title = element_text(hjust = 0.5)) + theme(axis.title=element_text(size=24)) + theme(axis.text.y = element_text(size=18)) + theme (axis.text.x = element_text(size=18)) + theme(legend.text = element_text(size = 18), legend.title = element_text(size = 18))
# ggplot(results, aes(x=id, y=request_duration, group = type, colour=as.factor(task), shape=as.factor(algorithm))) + geom_point(size=4) + theme(axis.text.x = element_text(angle = 90, hjust = 1)) + labs(x = "Task ID", y = "Time in ms", colour = "Task", shape = "Algorithm") + ylim(0, 5000) + theme(plot.title = element_text(hjust = 0.5)) + theme(axis.title=element_text(size=24)) + theme(axis.text.y = element_text(size=18)) + theme (axis.text.x = element_text(size=18)) + theme(legend.text = element_text(size = 18), legend.title = element_text(size = 18))


# ggplot(results, aes(x=id, y=time, group = type, colour=as.factor(task), shape=as.factor(algorithm))) + geom_point(size=4) + theme(axis.text.x = element_text(angle = 90, hjust = 1)) + labs(x = "Task ID", y = "Time in ms", colour = "Task", shape = "Algorithm") + ylim(0, 5000) + theme(plot.title = element_text(hjust = 0.5)) + theme(axis.title=element_text(size=24)) + theme(axis.text.y = element_text(size=18)) + theme (axis.text.x = element_text(size=18)) + theme(legend.text = element_text(size = 18), legend.title = element_text(size = 18))


