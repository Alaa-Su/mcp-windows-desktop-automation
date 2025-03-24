/**
 * Process-related tools for MCP Windows Desktop Automation
 */

import * as autoIt from 'node-autoit-koffi';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createToolResponse, createErrorResponse, schemas } from '../utils/types';
import { log } from '../utils/logger/logger';

/**
 * Register process-related tools with the MCP server
 */
export function registerProcessTools(server: McpServer): void {
  // run - Run a program
  server.tool(
    'run',
    {
      program: z.string().describe('Program path or command'),
      workingDir: z.string().optional().describe('Working directory'),
      showFlag: z.number().optional().describe('Window show flag')
    },
    async ({ program, workingDir, showFlag }) => {
      try {
        log.verbose('run called', { program, workingDir, showFlag });
        await autoIt.init();
        const result = await autoIt.run(program, workingDir, showFlag);
        return createToolResponse(`Program "${program}" started with process ID: ${result}`);
      } catch (error) {
        log.error('run failed', error);
        return createErrorResponse(error instanceof Error ? error : String(error));
      }
    }
  );

  // runWait - Run a program and wait for it to complete
  server.tool(
    'runWait',
    {
      program: z.string().describe('Program path or command'),
      workingDir: z.string().optional().describe('Working directory'),
      showFlag: z.number().optional().describe('Window show flag')
    },
    async ({ program, workingDir, showFlag }) => {
      try {
        log.verbose('runWait called', { program, workingDir, showFlag });
        await autoIt.init();
        const result = await autoIt.runWait(program, workingDir, showFlag);
        return createToolResponse(`Program "${program}" completed with exit code: ${result}`);
      } catch (error) {
        log.error('runWait failed', error);
        return createErrorResponse(error instanceof Error ? error : String(error));
      }
    }
  );

  // runAs - Run a program as a different user
  server.tool(
    'runAs',
    {
      user: z.string().describe('Username'),
      domain: z.string().describe('Domain'),
      password: z.string().describe('Password'),
      logonFlag: z.number().describe('Logon flag'),
      program: z.string().describe('Program path or command'),
      workingDir: z.string().optional().describe('Working directory'),
      showFlag: z.number().optional().describe('Window show flag')
    },
    async ({ user, domain, password, logonFlag, program, workingDir, showFlag }) => {
      try {
        log.verbose('runAs called', { user, domain, logonFlag, program, workingDir, showFlag });
        await autoIt.init();
        const result = await autoIt.runAs(user, domain, password, logonFlag, program, workingDir, showFlag);
        return createToolResponse(`Program "${program}" started as user "${user}" with process ID: ${result}`);
      } catch (error) {
        log.error('runAs failed', error);
        return createErrorResponse(error instanceof Error ? error : String(error));
      }
    }
  );

  // runAsWait - Run a program as a different user and wait for it to complete
  server.tool(
    'runAsWait',
    {
      user: z.string().describe('Username'),
      domain: z.string().describe('Domain'),
      password: z.string().describe('Password'),
      logonFlag: z.number().describe('Logon flag'),
      program: z.string().describe('Program path or command'),
      workingDir: z.string().optional().describe('Working directory'),
      showFlag: z.number().optional().describe('Window show flag')
    },
    async ({ user, domain, password, logonFlag, program, workingDir, showFlag }) => {
      try {
        log.verbose('runAsWait called', { user, domain, logonFlag, program, workingDir, showFlag });
        await autoIt.init();
        const result = await autoIt.runAsWait(user, domain, password, logonFlag, program, workingDir, showFlag);
        return createToolResponse(`Program "${program}" completed as user "${user}" with exit code: ${result}`);
      } catch (error) {
        log.error('runAsWait failed', error);
        return createErrorResponse(error instanceof Error ? error : String(error));
      }
    }
  );

  // processExists - Check if a process exists
  server.tool(
    'processExists',
    {
      process: schemas.processName
    },
    async ({ process }) => {
      try {
        log.verbose('processExists called', { process });
        await autoIt.init();
        const result = await autoIt.processExists(process);
        const exists = result !== 0;
        return createToolResponse(
          exists
            ? `Process "${process}" exists with PID: ${result}`
            : `Process "${process}" does not exist`
        );
      } catch (error) {
        log.error('processExists failed', error);
        return createErrorResponse(error instanceof Error ? error : String(error));
      }
    }
  );

  // processClose - Close a process
  server.tool(
    'processClose',
    {
      process: schemas.processName
    },
    async ({ process }) => {
      try {
        log.verbose('processClose called', { process });
        await autoIt.init();
        const result = await autoIt.processClose(process);
        const success = result === 1;
        return createToolResponse(
          success
            ? `Process "${process}" closed successfully`
            : `Failed to close process "${process}"`
        );
      } catch (error) {
        log.error('processClose failed', error);
        return createErrorResponse(error instanceof Error ? error : String(error));
      }
    }
  );

  // processSetPriority - Set process priority
  server.tool(
    'processSetPriority',
    {
      process: schemas.processName,
      priority: z.number().describe('Priority level (0-4)')
    },
    async ({ process, priority }) => {
      try {
        log.verbose('processSetPriority called', { process, priority });
        await autoIt.init();
        const result = await autoIt.processSetPriority(process, priority);
        const success = result === 1;
        return createToolResponse(
          success
            ? `Priority for process "${process}" set to ${priority}`
            : `Failed to set priority for process "${process}"`
        );
      } catch (error) {
        log.error('processSetPriority failed', error);
        return createErrorResponse(error instanceof Error ? error : String(error));
      }
    }
  );

  // processWait - Wait for a process to exist
  server.tool(
    'processWait',
    {
      process: schemas.processName,
      timeout: schemas.processTimeout
    },
    async ({ process, timeout }) => {
      try {
        log.verbose('processWait called', { process, timeout });
        await autoIt.init();
        const result = await autoIt.processWait(process, timeout);
        const success = result !== 0;
        return createToolResponse(
          success
            ? `Process "${process}" exists with PID: ${result}`
            : `Timed out waiting for process "${process}"`
        );
      } catch (error) {
        log.error('processWait failed', error);
        return createErrorResponse(error instanceof Error ? error : String(error));
      }
    }
  );

  // processWaitClose - Wait for a process to close
  server.tool(
    'processWaitClose',
    {
      process: schemas.processName,
      timeout: schemas.processTimeout
    },
    async ({ process, timeout }) => {
      try {
        log.verbose('processWaitClose called', { process, timeout });
        await autoIt.init();
        const result = await autoIt.processWaitClose(process, timeout);
        const success = result === 1;
        return createToolResponse(
          success
            ? `Process "${process}" closed within the timeout`
            : `Timed out waiting for process "${process}" to close`
        );
      } catch (error) {
        log.error('processWaitClose failed', error);
        return createErrorResponse(error instanceof Error ? error : String(error));
      }
    }
  );

  // shutdown - Shut down the system
  server.tool(
    'shutdown',
    {
      flags: z.number().describe('Shutdown flags')
    },
    async ({ flags }) => {
      try {
        log.verbose('shutdown called', { flags });
        await autoIt.init();
        const result = await autoIt.shutdown(flags);
        const success = result === 1;
        return createToolResponse(
          success
            ? `System shutdown initiated with flags: ${flags}`
            : `Failed to initiate system shutdown`
        );
      } catch (error) {
        log.error('shutdown failed', error);
        return createErrorResponse(error instanceof Error ? error : String(error));
      }
    }
  );
}
