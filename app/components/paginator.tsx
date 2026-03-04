import { Box, Button, Flex } from "@radix-ui/themes";

const noop = () => {};

export const Paginator = ({offset = 0, pageSize = 0, totalPages = 1, goToFirstPage = noop, prev = noop, next = noop, goToLastPage = noop}) => {
    return <Flex gap="3" align="center">
        <Button onClick={goToFirstPage}>{'<<'}</Button>
        <Button onClick={prev}>{'<'}</Button>
        {/* TODO turn this into dropdown */}
        <Box>Showing {offset + 1} of {totalPages}</Box>
        <Button onClick={next}>{'>'}</Button>
        <Button onClick={goToLastPage}>{'>>'}</Button>
    </Flex>;
};