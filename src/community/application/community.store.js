/**
 * Application service store for the Community bounded context (student forum).
 *
 * @module useCommunityStore
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { CommunityApi } from '../infrastructure/community-api.js';
import { CommunityAssembler } from '../infrastructure/community.assembler.js';
import { ThreadAssembler } from '../infrastructure/thread.assembler.js';
import { CommentAssembler } from '../infrastructure/comment.assembler.js';
import { Comment } from '../domain/model/comment.entity.js';

const communityApi = new CommunityApi();

export const useCommunityStore = defineStore('community', () => {
    const communities = ref([]);
    const threads = ref([]);
    const comments = ref([]);
    /** Community used to filter the threads (null = all of my communities). */
    const selectedCommunityId = ref(null);
    const errors = ref([]);

    /** @param {string} studentId @returns {import('../domain/model/community.entity.js').Community[]} */
    function myCommunities(studentId) {
        return communities.value.filter(community => community.hasMember(studentId));
    }

    const visibleThreads = computed(() =>
        selectedCommunityId.value
            ? threads.value.filter(thread => thread.communityId === selectedCommunityId.value)
            : threads.value);

    async function fetchForum() {
        try {
            const [communitiesResponse, threadsResponse] = await Promise.all([
                communityApi.getCommunities(), communityApi.getThreads()
            ]);
            communities.value = CommunityAssembler.toEntitiesFromResponse(communitiesResponse);
            threads.value = ThreadAssembler.toEntitiesFromResponse(threadsResponse);
        } catch (error) {
            errors.value.push(error);
        }
    }

    /** @param {?string} communityId - Toggles the community filter. */
    function selectCommunity(communityId) {
        selectedCommunityId.value = selectedCommunityId.value === communityId ? null : communityId;
    }

    /** @param {string} threadId */
    async function fetchComments(threadId) {
        comments.value = [];
        try {
            const response = await communityApi.getCommentsByThreadId(threadId);
            comments.value = CommentAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Publishes a comment and increments the thread counter.
     * @param {string} threadId
     * @param {string} authorName
     * @param {string} content
     */
    async function addComment(threadId, authorName, content) {
        const text = (content ?? '').trim();
        if (!text) return;
        try {
            const entity = new Comment({ threadId, authorName, content: text });
            const response = await communityApi.createComment(CommentAssembler.toResourceFromEntity(entity));
            comments.value.push(CommentAssembler.toEntityFromResource(response.data));
            const thread = threads.value.find(t => t.id === threadId);
            if (thread) {
                thread.commentsCount += 1;
                await communityApi.patchThread(threadId, { commentsCount: thread.commentsCount });
            }
        } catch (error) {
            errors.value.push(error);
        }
    }

    return {
        communities, threads, comments, selectedCommunityId, errors, visibleThreads,
        myCommunities, fetchForum, selectCommunity, fetchComments, addComment
    };
});

export default useCommunityStore;