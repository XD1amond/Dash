/**
 * Base Adapter Interface
 * 
 * This interface defines the contract for all data adapters.
 * Adapters are responsible for fetching data from various sources (REST API, GraphQL, etc.)
 * and returning it in a consistent format.
 */

/**
 * Base Adapter Interface
 */
export interface BaseAdapter {
  /**
   * Fetch data from the data source
   * 
   * @param endpoint - The endpoint to fetch data from
   * @param params - Optional parameters for the request
   * @returns Promise with the fetched data
   */
  fetchData<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
  
  /**
   * Create data in the data source
   * 
   * @param endpoint - The endpoint to create data at
   * @param data - The data to create
   * @returns Promise with the created data
   */
  createData<T>(endpoint: string, data: any): Promise<T>;
  
  /**
   * Update data in the data source
   * 
   * @param endpoint - The endpoint to update data at
   * @param id - The ID of the data to update
   * @param data - The data to update
   * @returns Promise with the updated data
   */
  updateData<T>(endpoint: string, id: string, data: any): Promise<T>;
  
  /**
   * Delete data from the data source
   * 
   * @param endpoint - The endpoint to delete data from
   * @param id - The ID of the data to delete
   * @returns Promise indicating success or failure
   */
  deleteData(endpoint: string, id: string): Promise<boolean>;
  
  /**
   * Batch fetch data from the data source
   * 
   * @param endpoint - The endpoint to fetch data from
   * @param ids - The IDs of the data to fetch
   * @returns Promise with the fetched data
   */
  batchFetch<T>(endpoint: string, ids: string[]): Promise<T[]>;
  
  /**
   * Stream data from the data source
   * 
   * @param endpoint - The endpoint to stream data from
   * @param params - Optional parameters for the request
   * @returns AsyncIterable with the streamed data
   */
  streamData?<T>(endpoint: string, params?: Record<string, any>): AsyncIterable<T>;
}