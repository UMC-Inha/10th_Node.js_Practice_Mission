export interface CreateStoreResponse {

  /**
   * 가게 ID
   * @example 1
   */
  storeId: number;

  /**
   * 가게 이름
   * @example "맛있는 치킨집"
   */
  storeName: string;

  /**
   * 주소
   * @example "서울특별시 강남구 테헤란로 123"
   */
  address: string;

  /**
   * 시/도
   * @example "서울특별시"
   */
  city: string;

  /**
   * 구
   * @example "강남구"
   */
  district: string;

  /**
   * 동
   * @example "역삼동"
   */
  neighborhood: string;

  /**
   * 상세 주소
   * @example "101호"
   */
  detail: string;

  /**
   * 위도
   * @example 37.4979
   */
  latitude: number;

  /**
   * 경도
   * @example 127.0276
   */
  longitude: number;

  /**
   * 생성일
   */
  createdAt: Date;
}