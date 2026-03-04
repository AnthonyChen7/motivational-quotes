'use client';

import { useState } from "react";

export const usePagination = ({pageSize}) => {

    const [pageIndex, setPageIndex] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

};