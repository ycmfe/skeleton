#!/bin/bash

###########################################################################
#       配置项

#   include lib
this_file=`pwd`"/"$0
this_dir=`dirname $this_file`
. $this_dir/deploy.sh


###########################################################################
#       帮助

if [ $# -lt 1 ] || [ "-h" = "$1" ] || [ "--help" = "$1" ]
then
echo "用法: $0 [是否执行前端编译 0: 编译 1:不编译]";
exit 0;
fi

build_static=$1

#      在根目录生成项目零时文件夹
DEPLOY_DIR="$HOME/deploy"
rm -rf $DEPLOY_DIR && mkdir -p $DEPLOY_DIR/$prj_nam

PROJECT_HOME_LEN=`echo "$PROJECT_HOME/" | wc -m | bc`

#       checkout 掉本地修改

git pull
releaseZip=release_$prj_nam
#       前端执行gulp编译
echo "\n=======提取最新版本=======\n";
git archive -o $DEPLOY_DIR/$releaseZip.zip HEAD
echo "\n=======解压最新版本=======\n"
/usr/bin/unzip $DEPLOY_DIR/$releaseZip.zip -d $DEPLOY_DIR/$releaseZip

#       读出所有的文件，并过滤黑名单"
files="";
while [ $# -ne 0 ]
do
    file=`echo "/usr/bin/find $DEPLOY_DIR/$releaseZip -regextype posix-extended -type f -not -regex '$blacklist' | cut -c '$PROJECT_HOME_LEN-1000' | xargs echo" | sh`
    files="${files}${file} "

        shift
done

#
if [ 0 -ne `expr "$files" : ' *'` ]; then
        echo "\n没有找到要上传的文件，请调整输入参数"
        exit 1;
fi

#       确认文件
echo "\n=== 上传文件列表 === \n"
no=0;

for file in $files
do
    no=`echo "$no + 1" | bc`
    echo "$no\t$file";
done
echo ""
deploy_confirm "确认文件列表？"
if [ 1 != $? ]; then
        exit 1;
fi

#       源文件打包
echo "\n=== 文件打包 === \n"
time=`date "+%Y%m%d%H%M%S"`
cd $DEPLOY_DIR/$releaseZip
src_tgz="$HOME/$prj_nam.${USER}.${time}.tgz"
tar cvfz $src_tgz * > /dev/null 2>&1
echo "$src_tgz"

if [ ! -s "$src_tgz" ]; then
    echo "错误：文件打包失败"
    exit 1
fi

if [ -z "$ENV_BETA" ]
then
        hosts="$online_clusters"
else
        hosts="$beta_clusters"
fi

echo "\n=== 开始部署 ==="

#       同步"
host1="";
host1_src="";

for host in ${hosts}
do
        echo "\n=== ${host} ===\n"
        #       获取此主机的对应文件
        online_src="/data/bw/bak/$ssh_user/${USER}.$prj_nam.$host.tgz"
        $SSH $host tar cvhfz $online_src -C $dst $files > /dev/null 2>&1
        $SCP $host:$online_src $online_src > /dev/null 2>&1
        local_online="$DEPLOY_DIR/online/$host"
        rm -rf $local_online && mkdir -p $local_online
        tar xz -f $online_src -C $local_online

        #       记录基准主机
        if [ "" = "$host1_src" ]; then
                host1="$host"
                host1_src="$local_online"
        fi

        #       对比文件的 GIT 版本与线上版本
        echo "\t--- 逐个文件比较差异 ---\n"
        for file in $files
        do
                #       确定文件类型，只针对 text 类型
                type=`file $PROJECT_HOME/$file | grep "text"`
                if [ -z "$type" ]; then
                        continue
                fi

                echo "\t$file"
                diffs=`diff -Bb $PROJECT_HOME/$file $local_online/$file`

                #   如果没有不同就不要确认
                if [ -z "$diffs" ]; then
                        continue
                fi

                #       如果与基准主机的版本一致，就自动提交
                if [ "$host" != "$host1" ]
                then
                        tmp=`diff -Bb $host1_src/$file $local_online/$file`
                        if [ -z "$tmp" ]; then
                                continue
                        fi
                fi
        done
        #   进行 vimdiff
        sleep 1
        vimdiff $PROJECT_HOME/$file ${local_online}/$file

        deploy_confirm "        修改确认 $file ?"
        if [ 1 != $? ]; then
                exit 1;
        fi
        #       上传源文件
        dst_src_tgz=`basename $src_tgz`
        $SCP $src_tgz $host:~/$dst_src_tgz > /dev/null 2>&1

        $SSH $host "test -s ~/$dst_src_tgz"
        if [ 0 -ne $? ]; then
                echo "\t错误：文件上传失败"
                exit 1
        fi
        #       备份原始文件
        echo "\n\t--- 备份原始文件 ---\n"
        bak_src_tgz="/data/rms_v1_2/bak/$ssh_user/bak.${prj_nam}.${USER}.${time}.tgz"
        $SSH $host tar cvhfz ${bak_src_tgz} -C $dst $files > /dev/null 2>&1
        echo "\t${bak_src_tgz}"

        $SSH $host "test -s $bak_src_tgz"
        if [ 0 -ne $? ]; then
                echo "\t错误：远程主机原始文件备份失败"
                exit 1
        fi

        #       展开源文件
        echo "\n\t--- 部署文件 ---\n"
        $SSH $host "env LC_CTYPE=zh_CN.GB2312 tar xvfz ~/$dst_src_tgz -C $dst" 2>&1 | sed -e 's/^/      /'

        if [ 0 != $? ]
        then
                echo "\t错误：部署文件失败"
                deploy_confirm "        继续部署？"
                if [ 1 != $? ]; then
                        exit 1;
                fi
        fi
        if [ 1 != $build_static ]
        then
                echo "\n\t--- 编译静态资源 ---\n"
                $SSH $host "cd $dst && make prod"

        fi
        #       重启node
        $SSH $host "pm2 reload ${SERVER_NAME}"

        #   提示验证部署效果
        verify="    --- 上线完毕，执行此命令恢复原始版本： $SSH $host tar xvfz $bak_src_tgz -C $dst ";

        if [ "$host" = "$host1" ]
        then
                echo ""
                deploy_confirm "$verify，请验证效果"
                if [ 1 != $? ]; then
                        exit 1;
                fi
        else
                echo "\n$verify \n"
                rm -f $PROJECT_HOME/tools/revert.sh
                echo "$SSH $host tar xvfz $bak_src_tgz -C $dst" >> $PROJECT_HOME/tools/revert.sh

        fi
done

#       清理垃圾
rm -rf $src_tgz
if [ ! -z "$DEPLOY_DIR" ]
then
        rm -rf $DEPLOY_DIR
fi

echo "\n=== 上线完毕 ===\n"
