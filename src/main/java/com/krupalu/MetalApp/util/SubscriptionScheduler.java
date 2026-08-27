package com.krupalu.MetalApp.util;

import lombok.RequiredArgsConstructor;
import org.quartz.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class SubscriptionScheduler {

    private final Scheduler scheduler;

    public void scheduleSubscription(String customerId) throws SchedulerException {
        JobDetail jobDetail = JobBuilder.newJob(SubscriptionJob.class)
                .withIdentity("subscriptionJob-" + customerId)
                .usingJobData("customerId", customerId)
                .usingJobData("priceId", "price_1U6oYlRrP8vTwa4U68YtfKWc")
                .usingJobData("currencyId", "usd")
                .build();

        LocalDateTime registrationDate = LocalDateTime.now();

        // First run: 6 months after registration
      /*  LocalDateTime firstBillingDate = registrationDate.plusMonths(6);*/


        // Cron: run at midnight on the same day-of-month as registration
        int dayOfMonth = registrationDate.getDayOfMonth();
        String cronExpr = String.format("0 0 0 %d * ?", dayOfMonth);

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("subscriptionTrigger-" + customerId)
                .startAt(Date.from(registrationDate.atZone(ZoneId.systemDefault()).toInstant()))
                .withSchedule(CronScheduleBuilder.cronSchedule(cronExpr))
                .build();

        scheduler.scheduleJob(jobDetail, trigger);
    }
}

