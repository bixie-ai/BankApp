package com.coding.exercise.bankapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "bankapp", password = "changeit")
public class VirtualThreadsTest {

    @Autowired
    private Environment environment;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void virtualThreadsConfigurationIsEnabled() {
        String virtualEnabled = environment.getProperty("spring.threads.virtual.enabled");
        assertEquals("true", virtualEnabled);
    }

    @Test
    void jvmSupportsVirtualThreads() {
        Thread vt = Thread.ofVirtual().unstarted(() -> {});
        assertTrue(vt.isVirtual(), "Thread created with ofVirtual() must be virtual");
    }

    @Test
    void concurrentVirtualThreadExecution() throws Exception {
        int threadCount = 100;
        ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
        CountDownLatch latch = new CountDownLatch(threadCount);
        List<String> threadNames = new CopyOnWriteArrayList<>();

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                threadNames.add(Thread.currentThread().toString());
                latch.countDown();
            });
        }

        latch.await();
        executor.close();

        assertEquals(threadCount, threadNames.size());
        assertTrue(threadNames.stream().allMatch(name -> name.contains("VirtualThread")),
                "All threads should be virtual threads");
    }

    @Test
    void applicationEndpointAccessible() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }
}
